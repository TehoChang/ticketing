import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

//再次接口中都是键值对
//!!!这个interface Event是专门给abstract class用的，它提取了所有event的共性，限制传入的type该有的属性
//功能是让abstract class跟event可以结合使用
//测试：
// Type 'TicketCreatedEvent' does not satisfy the !!constraint!! 'Event'.
//   Types of property 'subject' are incompatible.
    

//因为是abstract class所以要写成<T extends Event>吗?
//为什么不直接写<Event>
//这边的意思是，T是为一个type argument，我们往後在實際調用時，

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  //语法含意：不管我們傳入的type是什么，使用它的['data']属性
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
