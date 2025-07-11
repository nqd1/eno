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
      sensor_features: ["Sensor1", "Sensor2", "TEMP", "HUMI"],
      sensor_count: 4,
      sensor_types: {
        gas_sensors: ["Sensor1", "Sensor2"],
        environmental_sensors: ["TEMP", "HUMI"]
      },
      sensor_descriptions: {
        "Sensor1": "Cảm biến khí Sensor 1",
        "Sensor2": "Cảm biến khí Sensor 2", 
        TEMP: "Cảm biến nhiệt độ môi trường",
        HUMI: "Cảm biến độ ẩm không khí"
      }
    }
    
    return Response.json(fallbackData)
  }
}
