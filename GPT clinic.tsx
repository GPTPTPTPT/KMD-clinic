import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function GptClinicApp() {
  const [input, setInput] = useState("");
  const [module, setModule] = useState("MSK");
  const [output, setOutput] = useState(null);
  const [includeExplanation, setIncludeExplanation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    const prompt = `
당신은 임상의로서 다음 조건을 따릅니다.
- 모듈: ${module}
- 감각어 입력: ${input}
- 설명 출력: ${includeExplanation ? "True" : "False"}

주어진 한의학 진단 응답 구조(R1~R8)를 기반으로 응답을 생성하십시오.`;

    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setOutput(data.result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 GPT 진료 파트너</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <Textarea
            placeholder="감각어, 증상 입력 (예: 오른쪽 어깨 저림, 욱신거림)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {['MSK', '내과', '감각해석', '추나설명'].map((mod) => (
              <Button
                key={mod}
                variant={module === mod ? "default" : "outline"}
                onClick={() => setModule(mod)}
              >
                {mod}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={includeExplanation}
              onCheckedChange={() => setIncludeExplanation(!includeExplanation)}
            />
            <span>설명 포함</span>
          </div>

          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading ? "처리 중..." : "GPT 실행"}
          </Button>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardContent className="whitespace-pre-wrap p-4">
            {output}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
