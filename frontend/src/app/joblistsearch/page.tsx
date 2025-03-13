// pages/JobList.tsx
"use client";

import { useState } from "react";
import Layout from '@/components/Layout/Layout';
import ListJob from "./ListJob";

export default function JobList() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Layout>
      <div className="flex pt-36 bg-white flex-col">
        <ListJob />
      </div>
    </Layout>
  );
}
