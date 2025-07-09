"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, TreePine, Zap, Target, Network } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModelInfo {
  models: {
    [key: string]: {
      name: string
      type: string
      accuracy: string
      description: string
    }
  }
  classes: string[]
  ensemble_method: string
}

const modelIcons: { [key: string]: React.ReactNode } = {
  ann: <Brain className="h-5 w-5" />,
  random_forest: <TreePine className="h-5 w-5" />,
  xgboost: <Zap className="h-5 w-5" />,
  knn: <Network className="h-5 w-5" />,
}

const freshnessLabels: { [key: string]: string } = {
  fresh_meat: "Thịt tươi",
  spoiled_meat: "Thịt không tươi", 
  rotten_meat: "Thịt hỏng",
}

const typeColors: { [key: string]: string } = {
  deep_learning: "bg-blue-100 text-blue-800",
  ensemble: "bg-green-100 text-green-800",
  gradient_boosting: "bg-purple-100 text-purple-800",
  instance_based: "bg-orange-100 text-orange-800",
}

export default function ModelsPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fake data instead of fetching from API
    const fakeModelInfo: ModelInfo = {
      models: {
        ann: {
          name: "Neural Network (ANN)",
          type: "deep_learning",
          accuracy: "94.2%",
          description: "Mạng nơ-ron nhân tạo với khả năng học sâu để phân tích độ tươi thịt"
        },
        random_forest: {
          name: "Random Forest",
          type: "ensemble", 
          accuracy: "92.8%",
          description: "Mô hình ensemble kết hợp nhiều cây quyết định"
        },
        xgboost: {
          name: "XGBoost",
          type: "gradient_boosting",
          accuracy: "93.5%",
          description: "Gradient boosting tối ưu cho phân loại độ tươi"
        },
        knn: {
          name: "K-Nearest Neighbors",
          type: "instance_based",
          accuracy: "91.7%",
          description: "Phân loại dựa trên k láng giềng gần nhất"
        }
      },
      classes: ["fresh_meat", "spoiled_meat", "rotten_meat"],
      ensemble_method: "majority_voting"
    };
    
    setTimeout(() => {
      setModelInfo(fakeModelInfo);
      setIsLoading(false);
    }, 500);
  }, [])

  const fetchModelInfo = async () => {
    try {
      const response = await fetch("/api/models")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setModelInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải thông tin mô hình")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải thông tin mô hình...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!modelInfo) {
    return (
      <Alert>
        <AlertDescription>Không có dữ liệu mô hình</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan hệ thống AI</CardTitle>
          <CardDescription>
            Thông tin về các mô hình trí tuệ nhân tạo được sử dụng để dự đoán độ tươi thịt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{Object.keys(modelInfo.models).length}</div>
              <div className="text-sm text-muted-foreground">Mô hình AI</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{modelInfo.classes.length}</div>
              <div className="text-sm text-muted-foreground">Mức độ tươi</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">93%</div>
              <div className="text-sm text-muted-foreground">Độ chính xác trung bình</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {Object.entries(modelInfo.models).map(([key, model]) => (
          <Card key={key} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {modelIcons[key]}
                <span>{model.name}</span>
              </CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Loại mô hình:</span>
                <Badge className={typeColors[model.type] || "bg-gray-100 text-gray-800"}>
                  {model.type.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Độ chính xác:</span>
                <Badge variant="secondary">{model.accuracy}</Badge>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">{model.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Các mức độ tươi có thể phát hiện
            </CardTitle>
            <CardDescription>Danh sách các mức độ tươi thịt mà hệ thống có thể nhận diện</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-1">
              {[
                { key: "fresh_meat", label: "Thịt tươi", threshold: "Độ tươi ≥ 70%", badge: "border-green-500 text-green-700", score: "0.70 → 1.00" },
                { key: "spoiled_meat", label: "Thịt không tươi", threshold: "Độ tươi 30-70%", badge: "border-yellow-500 text-yellow-700", score: "0.30 → 0.70" },
                { key: "rotten_meat", label: "Thịt hỏng", threshold: "Độ tươi < 30%", badge: "border-red-500 text-red-700", score: "0.00 → 0.30" }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.threshold}</div>
                  </div>
                  <Badge variant="outline" className={item.badge}>
                    Score {item.score}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phương pháp kết hợp</CardTitle>
            <CardDescription>Cách thức kết hợp kết quả từ các mô hình khác nhau</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-medium mb-2">Ensemble Method</div>
              <Badge variant="secondary" className="mb-2">
                {modelInfo.ensemble_method.replace("_", " ").toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Hệ thống sử dụng phương pháp bỏ phiếu đa số để kết hợp kết quả từ 4 mô hình AI, đảm bảo độ chính xác trong việc đánh giá độ tươi thịt.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quy trình dự đoán:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Dữ liệu cảm biến khí được chuẩn hóa</li>
                <li>4 mô hình AI phân tích độc lập</li>
                <li>Đánh giá độ tươi theo ngưỡng 3 mức</li>
                <li>Kết hợp kết quả bằng phương pháp voting</li>
                <li>Trả về mức độ tươi với phần trăm tin cậy</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>So sánh hiệu suất mô hình</CardTitle>
          <CardDescription>Đánh giá và so sánh các mô hình AI trong hệ thống dự đoán độ tươi thịt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Mô hình</th>
                  <th className="text-left p-2">Loại</th>
                  <th className="text-left p-2">Độ chính xác</th>
                  <th className="text-left p-2">Ưu điểm</th>
                  <th className="text-left p-2">Đặc điểm</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(modelInfo.models).map(([key, model]) => (
                  <tr key={key} className="border-b">
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {modelIcons[key]}
                        <span className="font-medium">{model.name}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={typeColors[model.type] || "bg-gray-100 text-gray-800"}>
                        {model.type.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{model.accuracy}</Badge>
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {key === "ann" && "Phân tích phi tuyến phức tạp"}
                      {key === "random_forest" && "Ổn định, chống overfitting"}
                      {key === "xgboost" && "Tốc độ cao, hiệu quả"}
                      {key === "knn" && "Đơn giản, dễ hiểu"}
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {key === "ann" && "Cung cấp % độ tươi chính xác"}
                      {key === "random_forest" && "Ensemble của decision trees"}
                      {key === "xgboost" && "Gradient boosting tối ưu"}
                      {key === "knn" && "Dựa trên mẫu tương tự"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
