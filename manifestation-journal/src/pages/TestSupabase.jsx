import { useEffect } from 'react'
import { supabase } from '../services/supabase'

function TestSupabase() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')

      console.log('DATA:', data)
      console.log('ERROR:', error)
    }

    testConnection()
  }, [])

  return <h1>Supabase Test</h1>
}

export default TestSupabase