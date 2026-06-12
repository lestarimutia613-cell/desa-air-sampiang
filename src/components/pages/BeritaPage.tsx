'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar, User } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string | null;
  author: string;
  createdAt: string;
}

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((d) => { setNews(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (selectedNews) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedNews(null)}
            className="text-emerald-600 hover:text-emerald-800 mb-6 text-sm font-medium"
          >
            &larr; Kembali ke Berita
          </button>
          <article>
            <Badge className="bg-emerald-100 text-emerald-800 mb-4">Berita Terbaru</Badge>
            <h1 className="text-3xl font-bold text-emerald-900 mb-4">{selectedNews.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {formatDate(selectedNews.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" /> {selectedNews.author}
              </span>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">{selectedNews.content}</p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Berita</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Berita Terbaru Desa Air Sempiang</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Informasi terkini seputar kegiatan, program, dan perkembangan Desa Air Sempiang
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {news.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-shadow border-emerald-100 cursor-pointer group"
                onClick={() => setSelectedNews(item)}
              >
                <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-t-lg flex items-center justify-center">
                  <Newspaper className="h-12 w-12 text-emerald-400" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(item.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {item.author}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
