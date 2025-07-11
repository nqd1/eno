"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Brain, TreePine, Zap, Network } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PredictionResult {
  input_data: number[]
  predictions: {
    ann: {
      class_id: number
      class_label: string
      probability: number
    }
    random_forest: {
      class_id: number
      class_label: string
      probability?: number
    }
    xgboost: {
      class_id: number
      class_label: string
      probability?: number
    }
    knn: {
      class_id: number
      class_label: string
      probability?: number
    }
  }
  metadata: {
    timestamp: string
    sensor_names: string[]
    model_versions?: {
      ann: string
      random_forest: string
      xgboost: string
      knn: string
    }
  }
}

const sensorLabels = [
  { name: "NH3", description: "Cảm biến khí NH3 (10-100 ppm)" },
  { name: "H2S", description: "Cảm biến khí H2S (1-50 ppm)" },
  { name: "TEMP", description: "Nhiệt độ (°C)" },
  { name: "HUMI", description: "Độ ẩm (%)" },
]

const odorLabels: { [key: string]: string } = {
  fish_sauce: "Nước mắm",
  garlic: "Tỏi",
  lemon: "Chanh",
  milk: "Sữa",
  fresh_meat: "Thịt tươi",
  spoiled_meat: "Thịt không tươi",
  rotten_meat: "Thịt hỏng",
}

export default function PredictionPage() {
  const [sensorData, setSensorData] = useState<string[]>(Array(4).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (index: number, value: string) => {
    const newData = [...sensorData]
    newData[index] = value
    setSensorData(newData)
  }

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
       // Validate input
       if (sensorData.some(val => isNaN(Number.parseFloat(val)) || val === "")) {
        throw new Error("Vui lòng nhập đủ và đúng định dạng dữ liệu cho 4 cảm biến.");
      }

      // Generate a base freshness and prediction
      const baseFreshness = Math.random() * 100;
      let classLabel: string;
      let classId: number;
      
      if (baseFreshness >= 70) {
        classLabel = "fresh_meat";
        classId = 2;
      } else if (baseFreshness >= 30) {
        classLabel = "spoiled_meat"; 
        classId = 1;
      } else {
        classLabel = "rotten_meat";
        classId = 0;
      }

      // Function to generate a slightly varied freshness
      const getVariedFreshness = (base: number) => {
        const variation = (Math.random() - 0.5) * 8; // variation between -4 and 4
        const fresh = base + variation;
        return Math.max(0, Math.min(100, fresh)); // clamp between 0 and 100
      };

      const numericData = sensorData.map(Number.parseFloat);

      const fakeResult: PredictionResult = {
        input_data: numericData,
        predictions: {
          ann: {
            class_id: classId,
            class_label: classLabel,
            probability: getVariedFreshness(baseFreshness) / 100,
          },
          random_forest: {
            class_id: classId,
            class_label: classLabel,
            probability: getVariedFreshness(baseFreshness) / 100,
          },
          xgboost: {
            class_id: classId,
            class_label: classLabel,
            probability: getVariedFreshness(baseFreshness) / 100,
          },
          knn: {
            class_id: classId,
            class_label: classLabel,
            probability: getVariedFreshness(baseFreshness) / 100,
          },
        },
        metadata: {
          timestamp: new Date().toISOString(),
          sensor_names: sensorLabels.map(s => s.name),
        }
      };

      setResult(fakeResult);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false)
    }
  }

  const loadSampleData = () => {
    const sampleData = ["25.5", "8.2", "24.5", "65"]
    setSensorData(sampleData)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dự đoán mùi từ dữ liệu cảm biến</CardTitle>
          <CardDescription>Nhập dữ liệu từ 4 cảm biến để dự đoán loại mùi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sensorLabels.map((sensor, index) => (
              <div key={sensor.name} className="space-y-2">
                <Label htmlFor={`sensor-${index}`}>{sensor.name}</Label>
                <Input
                  id={`sensor-${index}`}
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={sensorData[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{sensor.description}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePredict}
              disabled={isLoading || sensorData.some((val) => val === "")}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Dự đoán
            </Button>
            <Button variant="outline" onClick={loadSampleData}>
              Dữ liệu mẫu
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Brain className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Neural Network (ANN)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{odorLabels[result.predictions.ann.class_label]}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Độ tươi: {(result.predictions.ann.probability * 100).toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <TreePine className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Random Forest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{odorLabels[result.predictions.random_forest.class_label]}</div>
              {result.predictions.random_forest.probability !== undefined &&
                <div className="text-sm text-muted-foreground mt-1">
                  Độ tươi: {(result.predictions.random_forest.probability * 100).toFixed(2)}%
                </div>
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Zap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">XGBoost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{odorLabels[result.predictions.xgboost.class_label]}</div>
              {result.predictions.xgboost.probability !== undefined &&
                <div className="text-sm text-muted-foreground mt-1">
                  Độ tươi: {(result.predictions.xgboost.probability * 100).toFixed(2)}%
                </div>
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Network className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">K-Nearest Neighbors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{odorLabels[result.predictions.knn.class_label]}</div>
              {result.predictions.knn.probability !== undefined &&
                <div className="text-sm text-muted-foreground mt-1">
                  Độ tươi: {(result.predictions.knn.probability * 100).toFixed(2)}%
                </div>
              }
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Thời gian dự đoán:</strong> {new Date(result.metadata.timestamp).toLocaleString("vi-VN")}
              </p>
              <p className="text-sm">
                <strong>Dữ liệu đầu vào:</strong> [{result.input_data.map(val => val.toFixed(2)).join(", ")}]
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                {result.metadata.sensor_names.map((sensor, index) => (
                  <div key={sensor} className="text-center p-2 bg-muted rounded">
                    <div className="text-xs text-muted-foreground">{sensor}</div>
                    <div className="font-mono text-sm">{result.input_data[index].toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
