"use client";

import { cn } from '@/lib/utils';
import React from 'react'
import Image from 'next/image';
import BookCoverSvg from './BookCoverSvg';

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyle: Record<BookCoverVariant, string> = {
    extraSmall: 'book-cover_extra_small',
    small: 'book-cover_small',
    medium: 'book-cover_medium',
    regular: 'book-cover_wide',
    wide: "book-cover_wide"
};

interface Props {
    className?: string;
    variant?: BookCoverVariant
    coverColor: string;
    coverImage: string
}

export const BookCover = ({ className, variant = "regular", coverColor = "#012B48", coverImage = "https://placehold.co/400X600.png" }: Props) => {
    return (
        <div className={cn("relative transition-all duration-300", variantStyle[variant], className,)}>

            <BookCoverSvg coverColor={coverColor}  />

            <div className="absolute z-10" style={{ left: '12%', width: "87.5%", height: "88%" }}>


                <Image src={coverImage} alt="Book Cover" fill className='rounded-sm object-fill' />
            </div>

        </div>
    )
}
