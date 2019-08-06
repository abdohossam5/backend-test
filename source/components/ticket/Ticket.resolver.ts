import { ObjectId } from "mongodb"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"

import { IGraphQLCustomResolversContext } from '../../interfaces'
import { ObjectIdScalar } from "../../objectId.scalar"

import TicketModel, { Ticket } from "./Ticket.entity"
import { AddTicketInput, ListTicketsInput, TicketInput } from "./Ticket.input"



@Resolver(() => Ticket)
export default class TicketResolver {
  @Query(() => Ticket, { nullable: true })
  public async ticket(@Arg("input") ticketInput: TicketInput): Promise<Ticket> {
    const ticket = await TicketModel.findById(ticketInput.id)
    if (!ticket) {
      throw new Error("No ticket found!")
    }
    return ticket
  }

  @Query(() => [Ticket])
  public async listTickets(@Arg("input") input: ListTicketsInput): Promise<Ticket[]> {
    const tickets = await TicketModel.find({})
    const result = tickets
      .filter(ticket => ticket.date.getTime() < input.cursor.getTime())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, input.limit)
    return result
  }

  @Mutation(() => [Ticket])
  public async syncTickets(@Ctx() ctx: IGraphQLCustomResolversContext): Promise<Ticket[]> {
    let hasMore = true;
    let count = 0;
    const BATCH_SIZE = 50;
    const result:Array<Ticket> = [];

    while (hasMore) {
      let tickets =  await ctx.dataSources.ticketsAPI.getTickets({ skip: count , limit: BATCH_SIZE });
      if (!tickets.length) break;

      // update count and check if has more
      count += tickets.length;
      hasMore = tickets.length === BATCH_SIZE;

      // filter tickets that has at least a title
      tickets = tickets.filter((t: Ticket) => t.title && t.title !== 'null')
      
      // construct bulk ops and upsert to db
      const ops = tickets.map(({ _id, ...t }: { _id: { $oid: string, t: Ticket } }) => ({
        updateOne: {
          filter: { _id: new ObjectId(_id.$oid) },
          'update': t,
          'upsert': true
        }
      }));
      await TicketModel.bulkWrite(ops);
      result.push(...tickets);
    }
    
    return result;
  }

  @Mutation(() => Ticket)
  public async addTicket(@Arg("input") ticketInput: AddTicketInput): Promise<Ticket> {
    const ticket = new TicketModel(ticketInput)
    return ticket.saveFields()
  }
}
