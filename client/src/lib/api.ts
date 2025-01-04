import { supabase } from './supabaseClient'

export type BalloonData = {
  message: string
  color: string
  text_size: number
  text_color: string
  font_weight: string
  font_style: string
}

export async function addMessage(data: BalloonData): Promise<void> {
  const { error } = await supabase
    .from('balloons') // 테이블 이름
    .insert([data])

  if (error) {
    throw new Error(`Error adding message: ${error.message}`)
  }
}

//모든 메세지 가져오기

export async function getMessages(): Promise<BalloonData[]> {
  const { data, error } = await supabase.from('balloons').select('*')

  if (error) {
    throw new Error(`Error getting messages: ${error.message}`)
  }

  return data || []
}
