// certificate
document.getElementById('cert-form')
.addEventListener('submit', async (e) => {
                e.preventDefault();

                const data = {
                    semester:     document.getElementById('semester').value,
                    academicYear: document.getElementById('academicYear').value,
                    issueDate:    document.getElementById('issueDate').value,
                };

                try {
                        const res = await fetch('/api/v1/grades/certificates', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
        
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = ` شهادات الفترة-${data.semester}-${data.academicYear}.docx`;
                            a.click();
                        
                    } catch (error) {
                        
                        console.log(error);                      
                        alert('certificates ERROR:', error);
                    }
                }
            )