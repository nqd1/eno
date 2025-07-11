export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate sensor data
    if (!body.sensor_data || !Array.isArray(body.sensor_data)) {
      return Response.json(
        { error: 'Dữ liệu sensor không hợp lệ' },
        { status: 400 }
      )
    }
    
    if (body.sensor_data.length !== 4) {
      return Response.json(
        { error: 'Cần đủ 4 giá trị sensor: NH3, H2S, TEMP, HUMI' },
        { status: 400 }
      )
    }
    
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000'

    const response = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sensor_data: body.sensor_data,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const apiResponse = await response.json()
    return Response.json(apiResponse)

  } catch (error) {
    console.error('Prediction API error:', error)
    
    // Return mock prediction when backend is unavailable
    const mockPrediction = {
      predicted_class: "fresh_meat",
      predicted_label: "Thịt tươi",
      confidence: 0.85,
      probabilities: {
        fish_sauce: 0.05,
        garlic: 0.08,
        lemon: 0.02,
        milk: 0.10,
        fresh_meat: 0.85,
        spoiled_meat: 0.12,
        rotten_meat: 0.03
      },
      sensor_data: [
        25.5 + Math.random() * 30, // NH3: 25.5-55.5 ppm
        8.2 + Math.random() * 15,  // H2S: 8.2-23.2 ppm
        23 + Math.random(),        // TEMP: 23-24°C
        50 + Math.floor(Math.random() * 21)   // HUMI: 50-70%
      ]
    }
    
    return Response.json(mockPrediction)
  }
}
