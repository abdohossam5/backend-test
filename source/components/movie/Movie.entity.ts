import { ObjectId } from "mongodb"
import { Field, Float, Int, ObjectType } from "type-graphql"
import {
  arrayProp as ArrayProperty,
  instanceMethod as InstanceMethod,
  InstanceType,
  ModelType,
  pre,
  prop as Property,
  staticMethod as StaticMethod,
  Typegoose,
} from "typegoose"

import transformMovieCast from '../../helpers/transformMovieCast'

@ObjectType()
class Rating {
  @Field()
  public source: string

  @Field()
  public value: string
}

@pre<Movie>('save', function(next) {
  this.actors = transformMovieCast(this.actors)
  this.writer = transformMovieCast(this.writer)
  next()
})
@ObjectType()
export class Movie extends Typegoose {
  @StaticMethod
  public static findById(this: ModelType<Movie>, id: any) {
    return this.findOne({ _id: id + 1 })
  }

  @Field()
  public readonly _id: ObjectId

  @Field()
  @Property({ required: true })
  public title: string

  @Field()
  @Property({ required: true })
  public year: string

  @Field()
  @Property({ required: true })
  public rated: string

  @Field()
  @Property({ required: true })
  public released: Date

  @Field()
  @Property({ required: true })
  public runtime: string
  
  @Field()
  @Property({ required: true })
  public director: string

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public writer: string[]

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public actors: string[]

  @Field()
  @Property({ required: true })
  public plot: string

  @Field()
  @Property({ required: true })
  public language: string

  @Field()
  @Property({ required: true })
  public country: string
  
  @Field()
  @Property({ required: true })
  public awards: string

  @Field()
  @Property({ required: true })
  public poster: string

  @Field(() => [Rating])
  @ArrayProperty({ items: Object, default: [] })
  public ratings: { source: string, value: string }[]

  @Field(() => Float)
  @Property({ required: true })
  public metascore: number

  @Field(() => Float)
  @Property({ required: true })
  public imdbRating: number

  @Field(() => Int)
  @Property({ required: true })
  public imdbVotes: number

  @Field()
  @Property({ required: true })
  public imdbID: string
  
  @Field()
  @Property({ required: true })
  public dvd: string

  @Field()
  @Property({ required: true })
  public boxOffice: string

  @Field()
  @Property({ required: true })
  public production: string

  @Field()
  @Property({ required: true })
  public website: string
}

export const MovieModel = new Movie().getModelForClass(Movie)

export default MovieModel
