
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:image/jpeg;base64," prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
};

export const dataUrlFromBase64 = (base64: string, mimeType: string = 'image/jpeg'): string => {
    return `data:${mimeType};base64,${base64}`;
};
