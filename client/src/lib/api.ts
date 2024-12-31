import { supabase } from './supabaseClient'

type BalloonData = {
  message: string
  color: string
}

export async function addMessage(data: BalloonData): Promise<void> {
  const { error } = await supabase
    .from('balloons') // 테이블 이름
    .insert([data])

  if (error) {
    throw new Error(`Error adding message: ${error.message}`)
  }
}
