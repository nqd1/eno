export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000'

    const response = await fetch(`${backendUrl}/sensors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const apiResponse = await response.json()
    return Response.json(apiResponse)

  } catch (error) {
    console.error('Sensors API error:', error)
    
    // Return fallback data for 4 main sensors
    const fallbackData = {
      sensor_features: ["NH3", "H2S", "TEMP", "HUMI"],
      sensor_count: 4,
      sensor_types: {
        gas_sensors: ["NH3", "H2S"],
        environmental_sensors: ["TEMP", "HUMI"]
      },
      sensor_descriptions: {
        "NH3": "Cảm biến khí Ammonia (NH3) - phát hiện khí amoniac",
        "H2S": "Cảm biến khí Hydrogen Sulfide (H2S) - phát hiện khí hydro sulfua", 
        TEMP: "Cảm biến nhiệt độ môi trường",
        HUMI: "Cảm biến độ ẩm không khí"
      }
    }
    
    return Response.json(fallbackData)
  }
}
