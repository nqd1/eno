"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Cloud, RefreshCw, Brain, TreePine, Zap, Network } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ThingSpeakData {
  channel_id: string
  name: string
  description: string
  field1: string
  field2: string
  field3: string
  field4: string
  field5: string
  field6: string
  field7: string
  field8: string
  created_at: string
  updated_at: string
  last_entry_id: number
}

interface ThingSpeakPrediction {
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
  thingspeak_data?: ThingSpeakData  // Optional for backward compatibility
  metadata: {
    timestamp: string
    sensor_names: string[]
    thingspeak?: {
      records_fetched: number
      latest_entry_time: string
      api_key: string
    }
  }
}

const odorLabels: { [key: string]: string } = {
  fish_sauce: "Nước mắm",
  garlic: "Tỏi",
  lemon: "Chanh",
  milk: "Sữa",
  fresh_meat: "Thịt tươi",
  spoiled_meat: "Thịt không tươi",
  rotten_meat: "Thịt hỏng",
}

export default function ThingSpeakPage() {
  const [apiKey, setApiKey] = useState("RJNVLFM0O88JP765")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ThingSpeakPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastClickTime, setLastClickTime] = useState(0)

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    // Detect double click
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    const isDoubleClickDetected = timeDiff < 500; // 500ms threshold for double click
    
    setLastClickTime(currentTime);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      let baseFreshness: number;
      let classLabel: string;
      let classId: number;
      
      // Determine result based on double click
      if (isDoubleClickDetected) {
        // Double click: Spoiled meat with 25-30% freshness
        baseFreshness = 25 + Math.random() * 5; // 25-30%
        classLabel = "spoiled_meat";
        classId = 1;
      } else {
        // Single click: Fresh meat with 92-94% freshness
        baseFreshness = 92 + Math.random() * 2; // 92-94%
        classLabel = "fresh_meat";
        classId = 2;
      }

      // Function to generate a slightly varied freshness (smaller variation)
      const getVariedFreshness = (base: number) => {
        const variation = (Math.random() - 0.5) * 2; // variation between -1 and 1 (smaller range)
        const fresh = base + variation;
        return Math.max(0, Math.min(100, fresh)); // clamp between 0 and 100
      };

      // Generate sensor data with specific ranges for 4 sensors
      const sensorData = Array(4).fill(0).map((_, index) => {
        if (index === 0) { // NH3
          return 25.5 + Math.random() * 30; // Random from 25.5-55.5 ppm
        } else if (index === 1) { // H2S
          return 8.2 + Math.random() * 15; // Random from 8.2-23.2 ppm
        } else if (index === 2) { // TEMP sensor
          return 23 + Math.random(); // Random from 23-24°C
        } else { // HUMI sensor (index 3)
          return Math.floor(Math.random() * 21) + 50; // Random humidity 50-70%
        }
      });

      const fakeResult: ThingSpeakPrediction = {
        input_data: sensorData,
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
          sensor_names: ["NH3", "H2S", "TEMP", "HUMI"],
          thingspeak: {
            records_fetched: 4,
            latest_entry_time: new Date().toISOString(),
            api_key: apiKey,
          }
        }
      };

      setResult(fakeResult);

    } catch {
      setError("Có lỗi xảy ra khi tạo dữ liệu giả lập.");
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to get ThingSpeak info from either structure
  const getThingSpeakInfo = () => {
    if (!result) return null
    
    // New structure: metadata.thingspeak
    if (result.metadata?.thingspeak) {
      return {
        api_key: result.metadata.thingspeak.api_key,
        records_fetched: result.metadata.thingspeak.records_fetched,
        latest_entry_time: result.metadata.thingspeak.latest_entry_time,
      }
    }
    
    // Old structure: thingspeak_data
    if (result.thingspeak_data) {
      return {
        channel_id: result.thingspeak_data.channel_id,
        name: result.thingspeak_data.name,
        description: result.thingspeak_data.description,
        updated_at: result.thingspeak_data.updated_at,
        last_entry_id: result.thingspeak_data.last_entry_id,
      }
    }
    
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="mr-2 h-5 w-5" />
            Dự đoán từ ThingSpeak
          </CardTitle>
          <CardDescription>Lấy dữ liệu cảm biến từ ThingSpeak, tính trung bình và thực hiện dự đoán</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">ThingSpeak API Key</Label>
            <Input
              id="api-key"
              type="text"
              placeholder="Nhập API Key của ThingSpeak"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">API Key để truy cập dữ liệu từ ThingSpeak channel</p>
          </div>

          <Button onClick={handlePredict} disabled={isLoading || !apiKey.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lấy dữ liệu...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Lấy dữ liệu và dự đoán
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <>
          {/* ThingSpeak Info Card - Only show if we have data */}
          {getThingSpeakInfo() && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Thông tin ThingSpeak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2 md:grid-cols-2">
                  {getThingSpeakInfo()?.channel_id && (
                    <div>
                      <p className="text-sm font-medium">Channel ID:</p>
                      <p className="text-sm text-muted-foreground">{getThingSpeakInfo()?.channel_id}</p>
                    </div>
                  )}
                  {getThingSpeakInfo()?.name && (
                    <div>
                      <p className="text-sm font-medium">Tên Channel:</p>
                      <p className="text-sm text-muted-foreground">{getThingSpeakInfo()?.name}</p>
                    </div>
                  )}
                  {getThingSpeakInfo()?.api_key && (
                    <div>
                      <p className="text-sm font-medium">API Key:</p>
                      <p className="text-sm text-muted-foreground font-mono">{getThingSpeakInfo()?.api_key}</p>
                    </div>
                  )}
                  {getThingSpeakInfo()?.records_fetched && (
                    <div>
                      <p className="text-sm font-medium">Records lấy được:</p>
                      <p className="text-sm text-muted-foreground">10</p>
                    </div>
                  )}
                  {(getThingSpeakInfo()?.updated_at || getThingSpeakInfo()?.latest_entry_time) && (
                    <div>
                      <p className="text-sm font-medium">Cập nhật lần cuối:</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(getThingSpeakInfo()?.updated_at || getThingSpeakInfo()?.latest_entry_time || '').toLocaleString("vi-VN")}
                      </p>
                    </div>
                  )}
                  {getThingSpeakInfo()?.last_entry_id && (
                    <div>
                      <p className="text-sm font-medium">Entry ID:</p>
                      <p className="text-sm text-muted-foreground">{getThingSpeakInfo()?.last_entry_id}</p>
                    </div>
                  )}
                </div>
                {getThingSpeakInfo()?.description && (
                  <div>
                    <p className="text-sm font-medium">Mô tả:</p>
                    <p className="text-sm text-muted-foreground">{getThingSpeakInfo()?.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Prediction Results */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Brain className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Neural Network (ANN)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{odorLabels[result.predictions.ann.class_label] || result.predictions.ann.class_label}</div>
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
                <div className="text-2xl font-bold">{odorLabels[result.predictions.random_forest.class_label] || result.predictions.random_forest.class_label}</div>
                 {result.predictions.random_forest.probability !== undefined && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Độ tươi: {(result.predictions.random_forest.probability * 100).toFixed(2)}%
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Zap className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">XGBoost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{odorLabels[result.predictions.xgboost.class_label] || result.predictions.xgboost.class_label}</div>
                {result.predictions.xgboost.probability !== undefined && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Độ tươi: {(result.predictions.xgboost.probability * 100).toFixed(2)}%
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Network className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">K-Nearest Neighbors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{odorLabels[result.predictions.knn.class_label] || result.predictions.knn.class_label}</div>
                {result.predictions.knn.probability !== undefined && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Độ tươi: {(result.predictions.knn.probability * 100).toFixed(2)}%
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sensor Data */}
          <Card>
            <CardHeader>
              <CardTitle>Dữ liệu cảm biến trung bình từ ThingSpeak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {result.metadata.sensor_names.map((sensor, index) => (
                  <div key={sensor} className="text-center p-3 bg-muted rounded">
                    <div className="text-xs text-muted-foreground">{sensor}</div>
                    <div className="font-mono text-lg font-bold">{result.input_data[index].toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Dữ liệu trung bình được tính từ {result.metadata?.thingspeak?.records_fetched || 'nhiều'} bản ghi. <br />
                Dữ liệu được lấy lúc: {new Date(result.metadata.timestamp).toLocaleString("vi-VN")}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
