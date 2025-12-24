"use client"

import { useState, useEffect, useRef } from "react"
import {
  Briefcase,
  FileText,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Upload,
  CheckCircle,
  Target,
  Zap,
  Mic,
  Square,
  Play,
  Pause,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [industry, setIndustry] = useState("tech")
  const [answer, setAnswer] = useState("")
  const [typingSpeed, setTypingSpeed] = useState(0)
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [points, setPoints] = useState(385)
  const [level, setLevel] = useState(3)
  const [showFeedback, setShowFeedback] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const questions = {
    tech: "Tell me about a challenging technical problem you solved recently.",
    marketing: "Describe a successful marketing campaign you've managed.",
    management: "How do you handle conflict within your team?",
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  useEffect(() => {
    if (answer.length > 0) {
      const words = answer.split(" ").length
      const minutes = timer / 60
      const wpm = minutes > 0 ? Math.round(words / minutes) : 0
      setTypingSpeed(wpm)

      const wordCount = words
      const avgWordLength = answer.replace(/\s+/g, "").length / Math.max(words, 1)
      const confidenceCalc = Math.min(100, Math.round((wordCount * 2 + avgWordLength * 5) / 2))
      setConfidenceScore(confidenceCalc)
    }
  }, [answer, timer])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      if (!isTimerRunning) {
        setIsTimerRunning(true)
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Could not access microphone. Please check your permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const playAudio = () => {
    if (audioURL && audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause()
        setIsPlayingAudio(false)
      } else {
        audioRef.current.play()
        setIsPlayingAudio(true)
      }
    }
  }

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
      setAudioURL(null)
      setIsPlayingAudio(false)
    }
  }

  const handleSubmitAnswer = () => {
    if (answer.length > 10 || audioURL) {
      setShowFeedback(true)
      setPoints((prev) => prev + Math.round(confidenceScore / 2))
      setIsTimerRunning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/10 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Google Gemini AI</span>
          </div>
          <h1 className="text-balance text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            AI Interview Buddy
          </h1>
          <p className="text-balance text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Practice & Level Up
          </p>
          <p className="text-pretty text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Mock interviews, resume tips, confidence tracking, and personalized AI guidance
          </p>
          <Button
            size="lg"
            className="text-lg h-12 px-8"
            onClick={() => {
              document.getElementById("interview-section")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <Target className="mr-2 h-5 w-5" />
            Start Your Interview
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 pb-20">
        <Tabs defaultValue="interview" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="interview">
              <MessageSquare className="h-4 w-4 mr-2" />
              Interview
            </TabsTrigger>
            <TabsTrigger value="resume">
              <FileText className="h-4 w-4 mr-2" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="progress">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Award className="h-4 w-4 mr-2" />
              Skills
            </TabsTrigger>
          </TabsList>

          {/* Mock Interview Section */}
          <TabsContent value="interview" id="interview-section">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Mock Interview Practice
                </CardTitle>
                <CardDescription>Practice with AI-powered feedback and confidence tracking</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Industry Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Technology
                        </div>
                      </SelectItem>
                      <SelectItem value="marketing">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Marketing
                        </div>
                      </SelectItem>
                      <SelectItem value="management">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Management
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Card */}
                <Card className="bg-accent/30 border-accent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono font-medium">{formatTime(timer)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-balance">{questions[industry as keyof typeof questions]}</p>
                  </CardContent>
                </Card>

                {/* AI Icebreaker Tip */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm mb-1">AI Icebreaker Tip</p>
                        <p className="text-sm text-muted-foreground">
                          Start with a brief context about the situation, then describe your approach, and finish with
                          the measurable outcome. Use the STAR method (Situation, Task, Action, Result).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Answer Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Your Answer</label>
                    <Badge variant="outline" className="gap-1">
                      <Zap className="h-3 w-3" />
                      {typingSpeed} WPM
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="Type your answer here..."
                    rows={8}
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value)
                      if (!isTimerRunning && e.target.value.length > 0) {
                        setIsTimerRunning(true)
                      }
                    }}
                    className="resize-none"
                  />
                </div>

                {/* Voice Recording Section */}
                <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mic className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Voice Answer</span>
                        </div>
                        {isRecording && (
                          <Badge variant="destructive" className="gap-1 animate-pulse">
                            <span className="h-2 w-2 rounded-full bg-white" />
                            Recording {formatTime(recordingTime)}
                          </Badge>
                        )}
                      </div>

                      {!audioURL ? (
                        <div className="flex gap-2">
                          {!isRecording ? (
                            <Button
                              onClick={startRecording}
                              variant="outline"
                              className="flex-1 bg-transparent"
                              disabled={isRecording}
                            >
                              <Mic className="mr-2 h-4 w-4" />
                              Start Recording
                            </Button>
                          ) : (
                            <Button onClick={stopRecording} variant="destructive" className="flex-1">
                              <Square className="mr-2 h-4 w-4" />
                              Stop Recording
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border">
                            <audio
                              ref={audioRef}
                              src={audioURL}
                              onEnded={() => setIsPlayingAudio(false)}
                              className="hidden"
                            />
                            <Button onClick={playAudio} variant="outline" size="sm">
                              {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Voice Recording</p>
                              <p className="text-xs text-muted-foreground">
                                {isPlayingAudio ? "Playing..." : "Ready to submit"}
                              </p>
                            </div>
                            <Button onClick={deleteRecording} variant="ghost" size="sm">
                              Delete
                            </Button>
                          </div>
                          <Button
                            onClick={startRecording}
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                          >
                            <Mic className="mr-2 h-4 w-4" />
                            Re-record
                          </Button>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Record your answer vocally for a more realistic interview experience
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Confidence Tracker */}
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence Level</span>
                        <span className="text-sm font-bold">{confidenceScore}%</span>
                      </div>
                      <Progress value={confidenceScore} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        Based on response length, word complexity, and pacing
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSubmitAnswer}
                  disabled={answer.length < 10 && !audioURL}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Submit Answer & Get Feedback
                </Button>

                {/* AI Feedback */}
                {showFeedback && (
                  <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-gradient-to-br from-primary/20 to-accent/20 border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5" />
                        AI Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium text-sm mb-2">Strengths:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Clear structure and logical flow</li>
                          <li>Good use of specific examples</li>
                          <li>Confident tone throughout</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-2">Areas to Improve:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Add more quantifiable results</li>
                          <li>Elaborate on the impact of your actions</li>
                        </ul>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">+{Math.round(confidenceScore / 2)} points earned!</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resume Analyzer Section */}
          <TabsContent value="resume">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Resume Analyzer
                </CardTitle>
                <CardDescription>Get AI-powered suggestions to improve your resume</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* File Upload */}
                <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Upload className="h-12 w-12 text-primary mb-4" />
                      <p className="text-sm font-medium mb-2">Upload your resume</p>
                      <p className="text-xs text-muted-foreground mb-4">PDF, DOCX, or TXT (Max 5MB)</p>
                      <Button variant="outline" className="bg-background" onClick={() => setUploadedFile("resume.pdf")}>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      {uploadedFile && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                          <CheckCircle className="h-4 w-4" />
                          <span>{uploadedFile} uploaded successfully</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Suggestions */}
                {uploadedFile && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI-Powered Suggestions
                    </h3>

                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">Add Quantifiable Metrics</CardTitle>
                          <Badge variant="secondary">Impact: High</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Include specific numbers and percentages to demonstrate your achievements more effectively.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Performance</Badge>
                          <Badge variant="outline">Results</Badge>
                          <Badge variant="outline">Growth</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">Strengthen Action Verbs</CardTitle>
                          <Badge variant="secondary">Impact: Medium</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Replace weak verbs like "responsible for" with stronger action words like "led," "developed,"
                          or "implemented."
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Leadership</Badge>
                          <Badge variant="outline">Initiative</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">Missing Keywords</CardTitle>
                          <Badge variant="secondary">Impact: High</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Add these industry-relevant keywords to improve ATS compatibility:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Cloud Computing</Badge>
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Agile</Badge>
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Data Analysis</Badge>
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Leadership</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress & Gamification Section */}
          <TabsContent value="progress">
            <div className="space-y-6">
              <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Your Progress
                  </CardTitle>
                  <CardDescription>Track your improvement and level up your skills</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Level & Points */}
                  <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                        <Award className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Level</p>
                        <p className="text-3xl font-bold">Level {level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Points</p>
                      <p className="text-3xl font-bold text-primary">{points}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress to Level {level + 1}</span>
                      <span className="text-sm text-muted-foreground">{points % 500}/500 XP</span>
                    </div>
                    <Progress value={(points % 500) / 5} className="h-4" />
                  </div>

                  {/* Badges */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Achievements & Badges
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                        <CardContent className="pt-6">
                          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <p className="font-medium text-sm">First Interview</p>
                          <p className="text-xs text-muted-foreground mt-1">Completed</p>
                        </CardContent>
                      </Card>
                      <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                        <CardContent className="pt-6">
                          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                            <Zap className="h-6 w-6 text-primary" />
                          </div>
                          <p className="font-medium text-sm">Fast Responder</p>
                          <p className="text-xs text-muted-foreground mt-1">Earned</p>
                        </CardContent>
                      </Card>
                      <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-accent/10 to-muted border-border">
                        <CardContent className="pt-6">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <Target className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">Perfect Score</p>
                          <p className="text-xs text-muted-foreground mt-1">Locked</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Confidence Chart */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">Confidence Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-end justify-around gap-2">
                        {[45, 52, 61, 68, 75, 82, confidenceScore || 78].map((value, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div
                              className="w-full bg-gradient-to-t from-primary to-primary/40 rounded-t-md transition-all duration-300"
                              style={{ height: `${(value / 100) * 100}%` }}
                            />
                            <span className="text-xs text-muted-foreground">{i + 1}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-center text-muted-foreground mt-4">Last 7 interviews</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mini Skill Test Section */}
          <TabsContent value="skills">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Quick Skill Assessment
                </CardTitle>
                <CardDescription>Test your knowledge and earn bonus points</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <Card className="border-primary/30 bg-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Question 1 of 2</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-balance font-medium">
                      What is the best way to demonstrate leadership in a technical interview?
                    </p>
                    <div className="space-y-2">
                      {[
                        "A) Talk about managing timelines and resources",
                        "B) Show examples of mentoring team members",
                        "C) Discuss technical decisions and their impact",
                        "D) All of the above",
                      ].map((option, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3 hover:bg-primary/10 hover:border-primary bg-transparent"
                          onClick={() => {
                            if (option.startsWith("D)")) {
                              setPoints((prev) => prev + 50)
                            }
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/30 bg-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Question 2 of 2</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-balance font-medium">
                      Which framework is best for answering behavioral questions?
                    </p>
                    <div className="space-y-2">
                      {[
                        "A) STAR (Situation, Task, Action, Result)",
                        "B) CAR (Challenge, Action, Result)",
                        "C) PAR (Problem, Action, Result)",
                        "D) SAR (Situation, Action, Result)",
                      ].map((option, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3 hover:bg-primary/10 hover:border-primary bg-transparent"
                          onClick={() => {
                            if (option.startsWith("A)")) {
                              setPoints((prev) => prev + 50)
                            }
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/10 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        Complete skill tests to earn bonus points and unlock new features. Each correct answer gives you
                        +50 points!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Interview Buddy
              </h3>
              <p className="text-sm text-muted-foreground">
                Empowering job seekers with AI-driven interview practice and feedback.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Technology</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Powered by Google Gemini AI
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Built For</h4>
              <p className="text-sm text-muted-foreground">TechSprint Hackathon 2025</p>
              <p className="text-sm text-muted-foreground">Team: Rovers</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-xs text-muted-foreground">
              © 2025 AI Interview Buddy. Built with Next.js, Tailwind CSS, and shadcn/ui.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
