import { store } from '@graphprotocol/graph-ts';
import {
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
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.nextStreamId(...)
  // - contract.getStream(...)
  // - contract.deltaOf(...)
  // - contract.balanceOf(...)
  // - contract.createStream(...)
  // - contract.withdrawFromStream(...)
  // - contract.cancelStream(...)
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
    stream.deposit = event.params.amount;
    stream.recipient = event.params.recipient;
    stream.save();
  }
  return;
}
