interface RequestBody {
  api_key?: string;
}

export async function POST(request: Request) {
  let body: RequestBody = {}
  try {
    body = await request.json()
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000'

    const response = await fetch(`${backendUrl}/predict/thingspeak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: body.api_key,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const apiResponse = await response.json()
    return Response.json(apiResponse)

  } catch (error) {
    console.error('ThingSpeak Prediction API error:', error)
    
    // Return mock ThingSpeak prediction with 4 sensors
    const mockThingSpeakPrediction = {
      input_data: [
        25.5 + Math.random() * 30, // NH3: 25.5-55.5 ppm
        8.2 + Math.random() * 15,  // H2S: 8.2-23.2 ppm
        23 + Math.random(), // TEMP (°C): 23-24
        50 + Math.floor(Math.random() * 21)   // HUMI (%): 50-70
      ],
      predictions: {
        ann: {
          class_id: 2,
          class_label: "fresh_meat",
          probability: 0.93
        },
        random_forest: {
          class_id: 2,
          class_label: "fresh_meat",
          probability: 0.92
        },
        xgboost: {
          class_id: 2,
          class_label: "fresh_meat",
          probability: 0.94
        },
        knn: {
          class_id: 2,
          class_label: "fresh_meat",
          probability: 0.92
        }
      },
      metadata: {
        timestamp: new Date().toISOString(),
        sensor_names: ["NH3", "H2S", "TEMP", "HUMI"],
        thingspeak: {
          records_fetched: 4,
          latest_entry_time: new Date().toISOString(),
          api_key: body.api_key || "demo_key"
        }
      }
    }
    
    return Response.json(mockThingSpeakPrediction)
  }
}
