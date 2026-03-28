'use client';

import { useState, useEffect } from 'react';

interface HistoryItem {
  id: string;
  time: string;
  language: string;
  codePreview: string;
  probability: number;
  confidence: string;
  summary: string;
}

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 页面加载时读取历史记录
  useEffect(() => {
    const saved = localStorage.getItem('codeguard_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // 保存历史记录
  const saveHistory = (data: any, lang: string, codeStr: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      time: new Date().toLocaleString('zh-CN'),
      language: lang,
      codePreview: codeStr.slice(0, 60) + (codeStr.length > 60 ? '...' : ''),
      probability: data.probability,
      confidence: data.confidence,
      summary: data.summary,
    };
    const updated = [newItem, ...history].slice(0, 20); // 最多保留20条
    setHistory(updated);
    localStorage.setItem('codeguard_history', JSON.stringify(updated));
  };

  // 清空历史
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('codeguard_history');
  };

  // 从历史记录恢复
  const loadFromHistory = (item: HistoryItem) => {
    setShowHistory(false);
  };

  const handleDetect = async () => {
    if (!code.trim()) {
      alert('请先输入代码');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setResult(data);
      saveHistory(data, language, code);
    } catch (error) {
      alert('检测失败: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const confidenceLabel = (c: string) =>
    c === 'high' ? '高' : c === 'medium' ? '中' : '低';
  const confidenceColor = (c: string) =>
    c === 'high' ? 'bg-red-100 text-red-700' :
    c === 'medium' ? 'bg-yellow-100 text-yellow-700' :
    'bg-green-100 text-green-700';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CodeGuard AI</h1>
          <p className="text-gray-600">AI代码检测工具 - 识别AI生成的代码</p>
        </div>

        {/* 历史记录按钮 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow text-gray-600 hover:bg-gray-50 text-sm font-medium"
          >
            📋 检测历史 {history.length > 0 && <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">{history.length}</span>}
          </button>
        </div>

        {/* 历史记录面板 */}
        {showHistory && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">检测历史记录</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700">
                  清空历史
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">暂无历史记录</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {history.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-gray-400">{item.time}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">{item.language}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${confidenceColor(item.confidence)}`}>
                          {item.probability}% · {confidenceLabel(item.confidence)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-mono truncate">{item.codePreview}</p>
                    <p className="text-xs text-gray-600 mt-1">{item.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 主表单 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择语言</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">粘贴代码</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="在此粘贴代码..."
              className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>

          <button
            onClick={handleDetect}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? '检测中...' : '开始检测'}
          </button>
        </div>

        {/* 检测结果 */}
        {result && (
          <div className="space-y-4">
            {/* 总体结果 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">检测结果</h2>
              {/* 概率 + 置信度 同行 */}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-gray-600 text-sm w-20 shrink-0">AI生成概率</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${result.probability}%` }}
                  />
                </div>
                <span className="text-2xl font-bold text-blue-600 w-16 text-right shrink-0">{result.probability}%</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${confidenceColor(result.confidence)}`}>
                  置信度：{confidenceLabel(result.confidence)}
                </span>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">{result.summary}</p>
            </div>

            {/* 详细指标 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-3 border-b pb-2">详细分析指标</h3>
              <div className="space-y-4">
                {result.indicators?.map((indicator: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-800">{indicator.name}</span>
                      <span className="text-sm font-bold text-blue-600 ml-4 shrink-0">{indicator.score}分</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${indicator.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{indicator.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 建议 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-3 border-b pb-2">建议</h3>
              <ul className="space-y-1">
                {result.suggestions?.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
