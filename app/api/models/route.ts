export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000'

    const response = await fetch(`${backendUrl}/models`, {
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
    console.error('Models API error:', error)
    
    // Return fallback data for models with 4 features
    const fallbackData = {
      available_models: [
        {
          name: "RandomForest",
          display_name: "Random Forest",
          accuracy: 0.92,
          features: ["Sensor1", "Sensor2", "TEMP", "HUMI"],
          feature_count: 4,
          description: "Mô hình Random Forest với 4 sensor chính"
        },
        {
          name: "SVM",
          display_name: "Support Vector Machine",
          accuracy: 0.89,
          features: ["Sensor1", "Sensor2", "TEMP", "HUMI"],
          feature_count: 4,
          description: "Mô hình SVM tối ưu hóa cho 4 sensor"
        },
        {
          name: "NeuralNetwork",
          display_name: "Neural Network",
          accuracy: 0.94,
          features: ["Sensor1", "Sensor2", "TEMP", "HUMI"],
          feature_count: 4,
          description: "Mạng neural với 4 đầu vào sensor"
        }
      ],
      total_models: 3,
      feature_count: 4,
      supported_features: ["Sensor1", "Sensor2", "TEMP", "HUMI"]
    }
    
    return Response.json(fallbackData)
  }
}
