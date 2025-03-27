'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  email: string;
  name: string;
  location: string;
  salary: string;
  resume: File | null;
}

const OpportunityForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    location: '',
    salary: '',
    resume: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
  };

  return (
    <section className="bg-[#577C8E] text-white p-8 rounded-lg mt-12 w-full max-w-[68vw] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">AYO LIHAT PELUANGMU</h2>

      <form onSubmit={handleSubmit} className="">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Input Fields */}
          <div className="space-y-4">
            {/* Input Nama Lengkap */}
            <div className="mt-2">
              <label className="text-gray-800 text-sm mb-1 block">Nama Lengkap</label>
              <div className="relative flex items-center">
                <input
                  name="fullname"
                  id="fullname"
                  type="text"
                  required
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-2 rounded-md outline-blue-600"
                  placeholder="Masukkan Nama Lengkap"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="mt-2">
              <label className="text-gray-800 text-sm mb-1 block">Email</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-2 rounded-md outline-blue-600"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>


            {/* Dropdown Lokasi */}
            <div className="mt-2">
              <label className="text-gray-800 text-sm mb-1 block">Harapan Lokasi</label>
              <select
                name="location"
                className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-2 rounded-md outline-blue-600"
                value={formData.location}
                onChange={handleInputChange}
              >
                <option value="">Harapan Lokasi</option>
                <option value="Sleman, DIY">Sleman, Daerah Istimewa Yogyakarta</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
              </select>
            </div>

            {/* Dropdown Pendapatan */}
            <div className="mt-2">
              <label className="text-gray-800 text-sm mb-1 block">Harapan Pendapatan</label>
              <select
                name="salary"
                className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-2 rounded-md outline-blue-600"
                value={formData.salary}
                onChange={handleInputChange}
              >
                <option value="">Harapan Pendapatan</option>
                <option value="2000000-5000000">Rp2.000.000 - Rp5.000.000</option>
                <option value="5000000-10000000">Rp5.000.000 - Rp10.000.000</option>
                <option value="10000000+">Rp10.000.000+</option>
              </select>
            </div>
          </div>


          {/* Right Column - Resume Upload & Buttons */}
          <div className="flex flex-col justify-between">
            <label className="text-gray-800 text-sm mb-1 block">Resume / Curriculum Vitae</label>

            <label className="w-full h-[20vw] xl:h-full mt-2 bg-white rounded-lg border-dashed border-2 border-gray-300 flex flex-col items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-500">Unggah Resume</span>
              <span className="text-gray-400 text-sm">(PDF Only, Max Size 5MB)</span>
              <input type="file" className="hidden" name="resume" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <div className="flex mt-10 justify-center gap-5 md:gap-5">
          <button type="submit" className="bg-[#2D3F4B] text-white px-6 py-2 rounded-full hover:bg-[#1a2b37] transition-colors w-1/2 md:w-1/5">
            LIHAT PELUANG
          </button>
          <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded-full hover:bg-gray-500 transition-colors w-1/2 md:w-1/5">
            Detail Kerja
          </button>
        </div>
      </form>
    </section>
  );
};

export default OpportunityForm;
