import { ObjectId } from "mongodb"
import { Field, Float, Int, ObjectType } from "type-graphql"
import {
  arrayProp as ArrayProperty,
  instanceMethod as InstanceMethod,
  InstanceType,
  ModelType,
  pre,
  prop as Property,
  Ref,
  staticMethod as StaticMethod,
  Typegoose,
} from "typegoose"

import transformGenres from '../../helpers/transformGenres'
import { Movie } from '../movie/Movie.entity'

@pre<Ticket>('save', function(next) {
  this.genre = transformGenres(this.genre[0])
  next()
})
@ObjectType()
export class Ticket extends Typegoose {

  @Field()
  public readonly _id: ObjectId

  @Field()
  @Property({ required: true })
  public title: string

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public genre: string[]

  @Field(() => Float)
  @Property({ required: true })
  public price: number

  @Field(() => Int)
  @Property({ required: true })
  public inventory: number

  @Field()
  @Property({ required: true })
  public image: string

  @Field()
  @Property({ required: true, index: true })
  public date: Date

  @Field(() => Movie)
  @Property({ ref: Movie })
  public movie: Ref<Movie>

  @InstanceMethod
  public saveFields(this: InstanceType<Ticket>) {
    // Inventory should always be at least 0
    this.inventory = Math.max(this.inventory || 0, 0)
    // transform genres
    this.genre = transformGenres(this.genre[0])
    return this.save()
  }
}

export const TicketModel = new Ticket().getModelForClass(Ticket)

export default TicketModel
