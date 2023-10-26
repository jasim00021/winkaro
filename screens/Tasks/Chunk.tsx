import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNFS from 'react-native-fs';


class Chunk {
   name: string;
   size: number;
   url: string;
   file: string;
   totalNumber: number;
   start: number;
   identity: string;
   codes: number[];
   fileSize: number;
   token: string;
   taskId: string;


   constructor(props: { name: string, size: number, url: string, taskId: string, token: string }) {
      this.name = props.name;
      this.size = props.size;
      this.url = props.url;
      this.token = props.token;
      this.taskId = props.taskId;
      this.totalNumber = 0;
      this.start = 0;
      this.file = '';
      this.fileSize = 0;
      this.identity = this.generateRandomString();
      this.codes = [400, 404, 415, 500, 501];

      console.log()
   }

   setFile(file: string, size: number) {
      this.file = file;
      this.setTotalNumber();
      this.fileSize = size;
   }

   setTotalNumber() {
      const total = Math.ceil(this.fileSize / this.size);

      this.totalNumber = total > 0 ? total : 1;
   }

   getNumber() {
      return (this.start / this.size) + 1;
   }

   generateRandomString(length = 32) {
      return [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
   }

   slice(start: number, end: number) {
      return this.file.slice(start, end - 1);
   }

   commit() {
      this.push(this.start, (this.start + this.size) + 1);
   }


   async push(start: number, end: number) {
      const data = new FormData();
      data.append(this.name, this.slice(start, end));
      data.append('task_id', this.taskId);

      axios.post(this.url, data, {
         headers: {
            'secret': 'hellothisisocdexindia',
            'Authorization': 'Bearer ' + this.token,
            'x-chunk-number': this.getNumber(),
            'x-chunk-total-number': this.totalNumber,
            'x-chunk-size': this.size,
            'x-file-name': this.file,
            'x-file-size': this.fileSize,
            'x-file-identity': this.identity
         }
      })
         .then(response => {
            this.start += this.size;

            switch (response.status) {
               // done
               case 200:
                  console.log(response.data);
                  break;

               // asking for the next chunk...
               case 201:
                  console.log(`${response.data.progress}% uploaded...`);

                  if (this.start < this.fileSize) {
                     this.commit();
                  }
                  break;
            }
         })
         .catch(error => {
            console.log(error)
            if (error.response) {
               if (this.codes.includes(error.response.status)) {
                  console.warn(error.response.status, 'Failed to upload the chunk.')
               } else if (error.response.status === 422) {
                  console.warn('Validation Error', error.response.data);
               } else {
                  console.log('Re-uploading the chunk...');
                  // this.commit();
               }
            } else {
               console.log('Re-uploading the chunk...');
               // this.commit();
            }
         });
   }
}

export default Chunk;