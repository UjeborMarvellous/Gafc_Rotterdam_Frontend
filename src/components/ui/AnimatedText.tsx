"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface AnimatedTextProps {
  texts: string[]
  className?: string
}

export default function AnimatedText({ texts, className = "" }: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentText = texts[currentIndex]
    let timeoutId: NodeJS.Timeout

    if (isTyping) {
      // Typing effect
      if (displayText.length < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, 100)
      } else {
        // Finished typing, wait 9 seconds then start erasing
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 9000)
      }
    } else {
      // Erasing effect
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
      } else {
        // Finished erasing, move to next text
        setCurrentIndex((prev) => (prev + 1) % texts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayText, isTyping, currentIndex, texts])

  return (
    <div className={`relative ${className}`}>
      <span className="block">
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="inline-block w-0.5 h-[1em] bg-current ml-1"
        />
      </span>
    </div>
  )
}
