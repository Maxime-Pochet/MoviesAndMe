import React from 'react';
import { 
  StyleSheet, 
  View, 
  Button, 
  TextInput, 
  ActivityIndicator
} from 'react-native'
import FilmList from './FilmList'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import { connect } from 'react-redux'


class Search extends React.Component {
  constructor(props){
    super(props);
    this.searchedText = "";
    this.page= 0;
    this.totalPages = 0;
    this.state = {
      films : [],
      isLoading: false
    }
  }

  searchFilms = () => {
    this.page = 0;
    this.totalPages = 0;
    this.setState({ films: [] }, () => {
      this.loadFilms();
    });
  }

  loadFilms = () => {
    if(this.searchedText.length > 0){
      this.setState({isLoading: true})
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1)
      .then(data => {
        this.page = data.page;
        this.totalPages = data.total_pages;
        this.setState({
          films : [...this.state.films, ...data.results],
          isLoading: false
      })})
    }
  }

  searchedTextInputChanged = (text) => {
    this.searchedText = text
  }

  displayDetailForFilm = (idFilm) => {
    this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
  }

  displayLoading = () => {
    if(this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }
  }


  render() {
    return(
      <View style={styles.main_container}>
        <TextInput 
          style={styles.textinput}
          placeholder="Titre du film"
          onChangeText={(text) => this.searchedTextInputChanged(text)}
          onSubmitEditing={() => this.searchFilms()}
        />
        <Button 
          style={styles.button}
          title="Rechercher" 
          onPress={() => this.searchFilms()} 
        />
        <FilmList
          films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
          navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
          loadFilms={() => this.loadFilms()} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
          page={this.page}
          totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
        />
          {this.displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#222222',
    borderWidth: 1,
    paddingLeft: 5
  },
  button:{
    height: 50
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = state => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(Search)