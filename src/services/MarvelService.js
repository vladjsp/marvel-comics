import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  //дістаєм потрібне для роботи з хука http
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=c6478a71351fec72321e96045044eb18';
  const _baseOffset = 210;
  const _baseComicsOffset = 0;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = _baseComicsOffset, limit = 8) => {
    const res = await request(
      `${_apiBase}comics?format=comic&formatType=comic&noVariants=true&limit=${limit}&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComics);
  };

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || 'There is no description',
      pageCount: comics.pageCount
        ? `${comics.pageCount} p.`
        : 'No information about the number of pages',
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      language: comics.textObjects[0]?.language || 'en-us',
      // optional chaining operator
      price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
    };
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  // повертаємо з хука те, що буде використовувати в компонентах
  // у кожного компонента буде своє значення цих параметрів яке встановиться при виклику
  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    clearError,
    getComics,
    getAllComics,
  };
};

export default useMarvelService;
