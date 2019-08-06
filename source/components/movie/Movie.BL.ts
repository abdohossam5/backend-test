
class MovieBL {
  public static cleanMovieTitle (t: string) {
    // remove 'a.k.a'
    let cleanedTitle = t.replace('a.k.a. ', '');
    // remove brackets
    cleanedTitle = t.replace(/\(|\)/g, '');
    // fix articles position (ex. Dark Knight Rises, The => The Dark Knight Rises)
    const articlesPattern = /(?:(, the$|, a$|, an$|, la$, le$))/i
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
}

export default new MovieBL();