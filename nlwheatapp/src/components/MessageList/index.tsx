import React, { useEffect, useState } from 'react'

import { ScrollView } from 'react-native'
import { io } from 'socket.io-client'
import { api } from '../../services/api'
import { Message } from '../Message'

import { styles } from './styles'

const messagesQueue: Message[] = []

const socket = io(String(api.defaults.baseURL))

socket.on('new_message', newMessage => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [currentMessages, setCurrentMessage] = useState<Message[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessage(prevState =>
          [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean)
        )
        messagesQueue.shift()
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    async function getMessages() {
      const messagesResponse = await api.get<Message[]>('messages/last3')
      setCurrentMessage(messagesResponse.data)
    }
    getMessages()
  }, [])
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map(message => (
        <Message data={message} key={message.id} />
      ))}
    </ScrollView>
  )
}
