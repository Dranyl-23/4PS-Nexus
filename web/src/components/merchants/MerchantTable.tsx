              <button onClick={() => setSelectedMerchant(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-lg">{selectedMerchant.name}</div>
                  <div className="text-sm text-slate-500">{selectedMerchant.category}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Stellar Wallet Address</p>
                  <p className="text-sm font-mono text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100 break-all">{selectedMerchant.address}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
                  <div className="flex items-center gap-1.5 text-sm">
                    {selectedMerchant.status === 'approved' && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                    {selectedMerchant.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                    {selectedMerchant.status === 'rejected' && <XCircle className="w-4 h-4 text-rose-500" />}
                    <span className="capitalize font-medium text-slate-700">{selectedMerchant.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setSelectedMerchant(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Close</button>
              {selectedMerchant.status !== 'approved' && (
                <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
                  Approve Merchant
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
