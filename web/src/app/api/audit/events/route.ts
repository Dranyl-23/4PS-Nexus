import { NextResponse } from 'next/server';
import { rpc, xdr, scValToNative } from 'govpay-vault';

export async function GET() {
  try {
    const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;
    if (!contractId) {
      return NextResponse.json({ error: 'Contract ID not configured' }, { status: 500 });
    }

    const server = new rpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC ?? 'https://soroban-testnet.stellar.org');
    
    // Fetch the latest ledger to know where to start looking backwards
    const latestLedgerResponse = await server.getLatestLedger();
    const latestLedger = latestLedgerResponse.sequence;
    
    // Fetch events from the last 5000 ledgers (approx 7 hours on testnet)
    const startLedger = Math.max(1, latestLedger - 5000);

    const eventsResponse = await server.getEvents({
      startLedger: startLedger,
      filters: [
        {
          type: "contract",
          contractIds: [contractId],
        }
      ],
      limit: 100 // max 100 events per page
    });

    // Parse the XDR events into a readable format for the AuditTable
    const formattedEvents = eventsResponse.events.map((event) => {
      let eventName = "unknown";
      let sender = "-";
      let receiver = "-";
      let amount = "-";
      let status = "safe";
      let reason = "-";

      try {
        if (event.topic && event.topic.length > 0) {
          // In newer stellar-sdk versions, topics and value in getEvents are already parsed xdr.ScVal objects
          const topic0 = scValToNative(event.topic[0] as any);
          eventName = topic0.toString();

          if (eventName === 'spend' && event.topic.length >= 3) {
            sender = scValToNative(event.topic[1] as any);
            receiver = scValToNative(event.topic[2] as any);
            amount = scValToNative(event.value as any).toString();
          } 
          else if (eventName === 'allocate' && event.topic.length >= 2) {
            sender = "DSWD (Treasury)";
            receiver = scValToNative(event.topic[1] as any);
            amount = scValToNative(event.value as any).toString();
          }
          else if (eventName === 'add') {
            sender = "DSWD (Admin)";
            receiver = scValToNative(event.value as any).toString();
            amount = "Merchant Whitelisted";
          }
          else if (eventName === 'freeze') {
             sender = "DSWD (Admin)";
             receiver = scValToNative(event.topic[1] as any).toString();
             amount = "Account Frozen";
             status = "rejected";
             reason = "Compliance Failure";
          }
        }
      } catch (parseError) {
        console.error("Failed to parse event XDR:", parseError);
      }

      return {
        id: `EVT-${event.ledger}-${(event as any).pagingToken?.substring(0, 8) || event.id.substring(0, 8)}`,
        hash: event.txHash,
        date: event.ledgerClosedAt || new Date().toISOString(),
        eventName: eventName,
        sender: sender,
        receiver: receiver,
        amount: amount !== "-" && !isNaN(Number(amount)) ? `₱${amount}` : amount,
        status: status,
        reason: reason,
      };
    });

    return NextResponse.json({ success: true, events: formattedEvents.reverse() });

  } catch (error: any) {
    console.error('[Audit API] Error fetching events:', error.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blockchain events' }, { status: 500 });
  }
}
