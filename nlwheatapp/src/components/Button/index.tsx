import React from 'react'

import {
  ActivityIndicator,
  ColorValue,
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native'

import { styles } from './styles'
import { AntDesign } from '@expo/vector-icons'

interface ButtonProps extends TouchableOpacityProps {
  color: ColorValue
  backgroundColor: ColorValue
  title: string
  icon?: React.ComponentProps<typeof AntDesign>['name']
  isLoading?: boolean
}

export function Button({
  backgroundColor,
  color,
  title,
  icon,
  isLoading = false,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      {...rest}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          <AntDesign name={icon} size={24} style={styles.icon} />
          <Text style={[styles.title, { color }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}
