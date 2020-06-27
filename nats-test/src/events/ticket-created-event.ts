import { Subjects } from './subjects';

export interface TicketCreatedEvent {

  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
//为什么需要枚举？
//枚举用来自定义我们想要的类型

//似乎接口中放的都是键值对？