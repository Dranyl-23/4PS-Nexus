import 'react-native-get-random-values';
import { Buffer } from 'buffer';
// @ts-ignore
import { EventTarget, Event } from 'event-target-shim';
// @ts-ignore
import { TextEncoder, TextDecoder } from 'text-encoding';

global.Buffer = global.Buffer || Buffer;
global.EventTarget = global.EventTarget || EventTarget;
global.Event = global.Event || Event;
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
