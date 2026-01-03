'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Bookmark, MessageCircle, Share2, MoreHorizontal, User, MapPin, CheckCircle2, Send } from 'lucide-react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';

const mockPosts = [
    {
        id: 1,
        owner: 'Azizbek Karimov',
        profession: 'Santexnik',
        region: 'Toshkent',
        avatar: null,
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1000&auto=format&fit=crop',
        saves: 124,
        comments: [
            { id: 1, user: 'Mijoz 1', text: 'Zo\'r ish bo\'libdi!' },
            { id: 2, user: 'Mijoz 2', text: 'Narxi qancha?' }
        ],
        description: 'Yangi xonadonda santexnika ishlarini yakunladik. Sifat va kafolat! #santexnika #remont #fixoo',
        time: '2 soat avval'
    },
    {
        id: 2,
        owner: 'Rustam Ahmedov',
        profession: 'Elektrik',
        region: 'Samarqand',
        avatar: null,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
        saves: 89,
        comments: [
            { id: 3, user: 'Usta 1', text: 'Omad!' }
        ],
        description: 'Murakkab montaj ishlari. Xavfsizlik birinchi o\'rinda! ⚡️ #elektrik #montaj #fixoo',
        time: '5 soat avval'
    },
    {
        id: 3,
        owner: 'Dilshod To\'rayev',
        profession: 'Mebelchi',
        region: 'Farg\'ona',
        avatar: null,
        image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000&auto=format&fit=crop',
        saves: 256,
        comments: [],
        description: 'Oshxona mebeli buyurtma asosida tayyor bo\'ldi. MDF material, sifatli furnitura. #mebel #oshxona #dizayn',
        time: '1 kun avval'
    }
];

export default function MastersFeed() {
    const t = useTranslations();
    const [posts, setPosts] = useState(mockPosts);
    const [savedPosts, setSavedPosts] = useState<number[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const saved = localStorage.getItem('saved_posts');
        if (saved) {
            setSavedPosts(JSON.parse(saved));
        }
    }, []);

    const handleSave = (id: number) => {
        let newSaved;
        if (savedPosts.includes(id)) {
            newSaved = savedPosts.filter(postId => postId !== id);
            toast.info("Saqlanganlardan olib tashlandi");
        } else {
            newSaved = [...savedPosts, id];
            toast.success("Saqlanganlarga qo'shildi");
        }
        setSavedPosts(newSaved);
        localStorage.setItem('saved_posts', JSON.stringify(newSaved));
    };

    const handleAddComment = (postId: number) => {
        const text = commentInputs[postId];
        if (!text?.trim()) return;

        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, { id: Date.now(), user: 'Siz', text }]
                };
            }
            return post;
        }));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
            <Navbar />

            <main className="max-w-2xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('masters_feed', { defaultMessage: 'Ustalar' })}</h1>
                    <p className="text-gray-600">Eng so'nggi ishlar va natijalar</p>
                </div>

                <div className="space-y-8">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Post Header */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 border-2 border-teal-50">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-bold text-gray-900">{post.owner}</h3>
                                            <CheckCircle2 size={14} className="text-blue-500 fill-blue-500" />
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <span className="font-medium text-teal-600">{post.profession}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5"><MapPin size={10} /> {post.region}</span>
                                        </p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                    <MoreHorizontal size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Post Image */}
                            <div className="relative aspect-square bg-gray-100">
                                <Image
                                    src={post.image}
                                    alt="Work"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Post Actions */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleSave(post.id)}
                                            className="flex items-center gap-1.5 group"
                                        >
                                            <Bookmark
                                                size={24}
                                                className={`transition-colors ${savedPosts.includes(post.id) ? 'text-teal-600 fill-teal-600' : 'text-gray-400 group-hover:text-teal-600'}`}
                                            />
                                            <span className="text-sm font-bold text-gray-700">{post.saves + (savedPosts.includes(post.id) ? 1 : 0)}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 group">
                                            <MessageCircle size={24} className="text-gray-400 group-hover:text-teal-500 transition-colors" />
                                            <span className="text-sm font-bold text-gray-700">{post.comments.length}</span>
                                        </button>
                                        <button className="group">
                                            <Share2 size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium">
                                        {post.time}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        <span className="font-bold mr-2">{post.owner}</span>
                                        {post.description}
                                    </p>
                                </div>

                                {/* Public Comments Section */}
                                {post.comments.length > 0 && (
                                    <div className="space-y-2 mb-4 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                        {post.comments.map(comment => (
                                            <div key={comment.id} className="text-sm">
                                                <span className="font-bold mr-2">{comment.user}</span>
                                                <span className="text-gray-600">{comment.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Comment Input */}
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Fikr bildirish..."
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                        className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                                    />
                                    <button
                                        onClick={() => handleAddComment(post.id)}
                                        className="text-teal-600 font-bold text-sm hover:text-teal-700 transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
            <ToastContainer position="bottom-right" />
        </div>
    );
}
