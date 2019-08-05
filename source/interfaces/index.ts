import TicketsAPI from "../dataSources/TicketsApi";

export interface IGraphQLCustomDataSources {
	ticketsAPI: TicketsAPI
}

export interface IGraphQLCustomResolversContext {
  dataSources: IGraphQLCustomDataSources;
}