"use client";
import { Button } from "@/components/ui/button"
import { ChangeEvent, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"

export default function Home() {
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string>();
  const [error, setError] = useState<string>();

  async function fetchAltFromAI() {
    if (!image) {
      toast.error("Please upload an image")
      return;
    }

    try {
      setLoading(true);
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const inputText = process.env.NEXT_PUBLIC_PROMPT;

      let imageParts;
      if (Array.isArray(image)) {
        imageParts = await Promise.all(image.map(fileToGenerativePart));
      } else {
        imageParts = [await fileToGenerativePart(image)];
      }
      const result = await model.generateContent([inputText, ...imageParts]);
      const text = result.response.text();

      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  }

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onCopy = () => {
    if (data) {
      navigator.clipboard.writeText(data);
      toast("Copied to clipboard")
    }
  };

  return (
    <main className="container mx-auto flex flex-col lg:px-[24px] xl:px-0 pt-[5rem] mb-[8rem]">
      <div className="w-full md:w-[50%] mx-auto flex flex-col items-center">
        <h1 className="text-center text-[4rem] font-bold mt-2">Altman</h1>
        <p className="text-center">Generate alternative texts for your images with AI.</p>

        <input type="file" name="image" id="image" className="hidden" onChange={onImageChange} />
        <label htmlFor="image" className="inline-block w-full mt-[3rem]">
          <div className="group cursor-pointer">
            <div className="w-full h-[80px] border-[2px] border-dashed border-neutral-200 rounded-lg grid place-content-center group-hover:border-neutral-600 transition-all duration-200 ease-in-out">
              <p className="font-bold text-neutral-400 group-hover:text-neutral-600 transition-all duration-200 ease-in-out">Upload your image</p>
            </div>
          </div>
        </label>
        <Button onClick={fetchAltFromAI} className="mt-[2rem]">
          <div className="size-4 mr-3">
            <svg className="w-ful h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ffffff">
              <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
            </svg>
          </div>
          Generate a stunning alt
        </Button>
      </div>

      {imagePreview && (
        <section className="md:w-[90%] mx-auto flex flex-col md:grid grid-cols-2 mt-[50px]">
          <div className="md:p-8 grid place-content-center">
            <img src={imagePreview} alt="Preview image" className="shadow-lg aspect-square lg:aspect-auto lg:max-h-[550px]" />
          </div>
          <div className="mt-8 md:mt-0 md:p-12">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="w-[190px] h-[20px] rounded-full" />
                <Skeleton className="w-[250px] h-[20px] rounded-full" />
                <Skeleton className="w-[90px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[40px] rounded-md inline-block" />
              </div>
            ) : (
              <div>
                <p>{data}</p>
                {data && <Button variant="secondary" className="mt-5" onClick={onCopy}>Copy it</Button>}
              </div>
            )}
          </div>
        </section>
      )}

    </main >
  );
}
