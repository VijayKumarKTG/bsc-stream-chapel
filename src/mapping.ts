import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
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
    stream.status = 'cancelled';
    let percent = new BigDecimal(new BigInt(100));
    stream.progress = percent.times(
      event.params.recipientBalance.divDecimal(new BigDecimal(stream.deposit))
    );
    stream.save();
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
  stream.tx = event.transaction.hash.toHexString();
  stream.status = 'active';
  stream.save();
}

export function handleWithdrawFromStream(event: WithdrawFromStream): void {
  let stream = Stream.load(event.params.streamId.toString());
  if (stream) {
    let sablier = Sablier.bind(event.address);
    let result = sablier.try_getStream(event.params.streamId);
    if (result.reverted) {
      stream.status = 'withdrawn';
      let percent = new BigDecimal(new BigInt(100));
      stream.progress = percent.times(
        event.params.amount.divDecimal(new BigDecimal(stream.deposit))
      );
      stream.save();
    }
  }
}
