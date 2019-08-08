import { ObjectId } from "mongodb"
import { Field, Float, Int, ObjectType } from "type-graphql"
import {
  arrayProp as ArrayProperty,
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
  @Property({ })
  public year: number

  @Field()
  @Property({ })
  public rated: string

  @Field()
  @Property({ })
  public released: Date

  @Field()
  @Property({ })
  public runtime: string
  
  @Field()
  @Property({ })
  public director: string

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public writer: string[]

  @Field(() => [String])
  @ArrayProperty({ items: String, default: [] })
  public actors: string[]

  @Field()
  @Property({ })
  public plot: string

  @Field()
  @Property({ })
  public language: string

  @Field()
  @Property({ })
  public country: string
  
  @Field()
  @Property({ })
  public awards: string

  @Field()
  @Property({ })
  public poster: string

  @Field(() => [Rating])
  @ArrayProperty({ items: Object, default: [] })
  public ratings: { source: string, value: string }[]

  @Field(() => Float)
  @Property({ })
  public metascore: number

  @Field(() => Float)
  @Property({ })
  public imdbRating: number

  @Field(() => Int)
  @Property({ })
  public imdbVotes: number

  @Field()
  @Property({ })
  public imdbID: string
  
  @Field()
  @Property({ })
  public dvd: string

  @Field(() => Float)
  @Property({ })
  public boxOffice: number

  @Field()
  @Property({ })
  public production: string

  @Field()
  @Property({ })
  public website: string
}

export const MovieModel = new Movie().getModelForClass(Movie)

export default MovieModel
