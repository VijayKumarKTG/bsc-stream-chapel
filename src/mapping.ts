import { log, store } from '@graphprotocol/graph-ts';
import {
  Sablier,
  CancelStream,
  CreateStream,
  WithdrawFromStream,
} from '../generated/Sablier/Sablier';
import { Stream } from '../generated/schema';

export function handleCancelStream(event: CancelStream): void {
  let stream = Stream.load(event.params.streamId.toString());
  if (stream) {
    store.remove('Stream', stream.id);
  }
  return;
}

export function handleCreateStream(event: CreateStream): void {
  let stream = Stream.load(event.params.streamId.toString());
  if (!stream) {
    stream = new Stream(event.params.streamId.toString());
  }
  stream.streamId = event.params.streamId;
  stream.deposit = event.params.deposit;
  stream.recipient = event.params.recipient;
  stream.stopTime = event.params.stopTime;
  stream.startTime = event.params.startTime;
  stream.sender = event.params.sender;
  stream.tokenAddress = event.params.tokenAddress;
  stream.save();
}

export function handleWithdrawFromStream(event: WithdrawFromStream): void {
  let stream = Stream.load(event.params.streamId.toString());
  if (stream) {
    let sablier = Sablier.bind(event.address);
    let result = sablier.try_getStream(event.params.streamId);
    if (result.reverted) {
      log.info('Stream', [stream.id]);
      store.remove('Stream', stream.id);
    }
  }
}
