import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"

import { IGraphQLCustomResolversContext } from '../../interfaces'

import TicketBL from './Ticket.BL';
import { Ticket } from "./Ticket.entity"
import { AddTicketInput, ListTicketsInput, TicketInput } from "./Ticket.input"



@Resolver(() => Ticket)
export default class TicketResolver {
  @Query(() => Ticket, { nullable: true })
  public async ticket(@Arg("input") ticketInput: TicketInput): Promise<Ticket> {
    return TicketBL.findTicket(ticketInput.id)
  }

  @Query(() => [Ticket])
  public async listTickets(@Arg("input") input: ListTicketsInput): Promise<Ticket[]> {
    return TicketBL.listTickets(input)
  }

  @Query(() => [Ticket])
  public async listNoMovieTickets(@Arg("input") input: ListTicketsInput): Promise<Ticket[]> {
    return TicketBL.listNoMovieTickets(input)
  }

  @Mutation(() => [Ticket])
  public async syncTickets(@Ctx() ctx: IGraphQLCustomResolversContext): Promise<Ticket[]> {
    return TicketBL.syncTickets(ctx)
  }

  @Mutation(() => Ticket)
  public async addTicket(@Arg("input") ticketInput: AddTicketInput): Promise<Ticket> {
    return TicketBL.addTicket(ticketInput)
  }
}
