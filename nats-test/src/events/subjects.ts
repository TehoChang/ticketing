export enum Subjects {
  TicketCreated = 'ticket:created',
  OrderUpdated = 'order:updated',
}
//枚举的功能：声明变量来自定义我们需要的subject(string type)
//  有一堆被我们锁定的subject string
//可以直接export枚举