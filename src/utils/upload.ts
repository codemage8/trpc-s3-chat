export function uploadFile(file: File, to: string) {
  const blob = new Blob([file], { type: file.type });
  return fetch(to, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: blob,
  });
}
