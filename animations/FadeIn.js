import React, { Component } from 'react'
import { Text, View, Dimensions, Animated } from 'react-native'

export default class FadeIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

  componentDidMount() {
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0
      }
    ).start()
  }

  render() {
    return (
      <Animated.View style={{left: this.state.positionLeft}}>
      {this.props.children}
      </Animated.View>
    )
  }
}
