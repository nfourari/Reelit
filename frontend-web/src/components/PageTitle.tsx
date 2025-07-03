// import React from 'react';

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <h1 id="title" className="text-3xl font-bold mb-6">
      {title}
    </h1>
  );
}