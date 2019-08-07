import { ObjectId } from 'mongodb';

import transformGenres from '../../helpers/transformGenres';
import { IGraphQLCustomResolversContext } from '../../interfaces'
import MovieBL from '../movie/Movie.BL'

import TicketModel, { Ticket } from "./Ticket.entity"
import { AddTicketInput, ListTicketsInput, TicketInput } from "./Ticket.input"


class TicketBL {
  public async findTicket(id: ObjectId): Promise<Ticket> {
    const ticket = await TicketModel.findById(id)
    if (!ticket) {
      throw new Error("No ticket found!")
    }
    return ticket
  }

  public async listTickets(input: ListTicketsInput): Promise<Ticket[]> {
    const tickets = await TicketModel.find({})
    const result = tickets
      .filter(ticket => ticket.date.getTime() < input.cursor.getTime())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, input.limit)
    return result
  }

  public async syncTickets(ctx: IGraphQLCustomResolversContext): Promise<Ticket[]> {
    let hasMore = true;
    let count = 0;
    const BATCH_SIZE = 50;
    const result: Array<Ticket> = [];

    while (hasMore) {
      let tickets = await ctx.dataSources.ticketsAPI.getTickets({ skip: count, limit: BATCH_SIZE });
      if (!tickets.length) break;

      // update count and check if has more
      count += tickets.length;
      hasMore = tickets.length === BATCH_SIZE;

      // filter tickets that has at least a title
      tickets = tickets.filter((t: Ticket) => t.title && t.title !== 'null')

      // construct bulk ops and upsert to db
      const ops = tickets.map(({ _id, ...t }: { _id: { $oid: string }, [key: string]: any }) => ({
        updateOne: {
          filter: { _id: new ObjectId(_id.$oid) },
          'update': { ...t, genre: transformGenres(t.genre) },
          'upsert': true
        }
      }));
      await TicketModel.bulkWrite(ops);
      result.push(...tickets);
    }

    // initiate movie fetching
    MovieBL.populateMovies();

    return result;
  }

  public async addTicket(ticketInput: AddTicketInput): Promise<Ticket> {
    const ticket = new TicketModel(ticketInput)
    return ticket.saveFields()
  }
}

export default new TicketBL();