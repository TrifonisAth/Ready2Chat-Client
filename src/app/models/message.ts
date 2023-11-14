export class Message {
  event: string;
  data: any;
  to: number;
  from: number;

  constructor(event: string, data: any, to: number, from: number) {
    this.event = event;
    this.data = data;
    this.to = to;
    this.from = from;
  }
}
