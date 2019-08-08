import transformMovieCast from '../../helpers/transformMovieCast'
import TicketModel, { Ticket } from '../ticket/Ticket.entity'

import { MovieModel } from './Movie.entity'
import MovieAPI from './MoviesApi.datasource'

const movieAPI = new MovieAPI()

class MovieBL {
  public static cleanMovieTitle (t: string) {
    // remove 'a.k.a'
    let cleanedTitle = t.replace('a.k.a.', '');
    // remove brackets
    cleanedTitle = t.replace(/\(|\)/g, '');
    // fix articles position (ex. Dark Knight Rises, The => The Dark Knight Rises)
    const articlesPattern = /(?:(, the$|, a$|, an$|, la$|, le$))/i
    const hasArticle = cleanedTitle.match(articlesPattern)
    if (hasArticle && hasArticle.length) {
      cleanedTitle = cleanedTitle.replace(articlesPattern, '');
      cleanedTitle = `${hasArticle[0].replace(', ', '')} ${cleanedTitle}`
    }
    return cleanedTitle.trim()
  }

  public static getPossibleMovieTitles (title: string) {
    const possibleTitles = []
    // normal title
    possibleTitles.push(MovieBL.cleanMovieTitle(title.split('(')[0].trim()))
    // alternative titles
    const alternativeTitlesPattern = /\((.*?)\)/g
    const matches = title.match(alternativeTitlesPattern) || []
    const cleanedAlternativeTitles = matches
    .map((alternativeTitle:string) => MovieBL.cleanMovieTitle(alternativeTitle))
    possibleTitles.push(...(cleanedAlternativeTitles))
    return possibleTitles;
  }
  
  public async populateMovies(): Promise<void> {
    // get tickets without movies
    const ticketsCursor = await TicketModel.find(
      { movie: { $exists: false } },
      { title: 1 }
    ).cursor()
    ticketsCursor.on('data', this.getTicketMovie)
  }

  private async getTicketMovie(t: Ticket): Promise<void> {
    const possibleTitles = MovieBL.getPossibleMovieTitles(t.title);

    for (const title of possibleTitles) {
      const movie = await movieAPI.searchMovies({ t: title })
      if (movie) {
        const transformedMovie = Object.keys(movie).reduce((movieObj: { [key: string]: any }, key) => {
          if (key === 'Response') return movieObj;

          const castKeys = ['Writer', 'Actors']
          // lowercase the key
          const transformedKey = `${key.charAt(0).toLowerCase()}${key.substr(1)}`;
          movieObj[transformedKey] = castKeys.includes(key)
            ? transformMovieCast(movie[key])
            : movie[key]
          
          switch (transformedKey) {
            case 'metascore':
              if (movieObj[transformedKey] === 'N/A') movieObj[transformedKey] = 0
              break
            case 'boxOffice':
            case 'imdbVotes':
            case 'imdbRating':
              if (movieObj[transformedKey] === 'N/A') movieObj[transformedKey] = 0
              if (typeof movieObj[transformedKey] === 'string') {
                movieObj[transformedKey] = movieObj[transformedKey].replace(/\$|,/g, '')
              }
              break
            case 'released':
              if (movieObj[transformedKey] === 'N/A') delete movieObj[transformedKey]
              break
            case 'year':
                if (movieObj[transformedKey].includes('–')) {
                  movieObj[transformedKey] = movieObj[transformedKey].replace(/\–.*$/, '')
                }
            default: break
          }

          return movieObj
        }, {})

        const movieDoc = new MovieModel(transformedMovie)
        await movieDoc.save()
        await TicketModel.updateOne({ _id: t._id }, { movie: movieDoc._id })
        return
      }
    }
  }

  
}

export default new MovieBL();