<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <chart-card :propShowSelecors="true" ></chart-card>
        </v-col>  
      </v-row>
    </v-container>
</template>

<script>
// @ is an alias to /src

import ChartCard from '../components/ChartCard';
/*
import { mdiMagnify } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import { mdiClose } from '@mdi/js';
import { mdiRefresh } from '@mdi/js';
import { mdiCheckboxMultipleMarkedOutline } from '@mdi/js';
*/
export default {
  name: 'about',
  components:{
    ChartCard,
  },
  mounted() {
      if (!this.$store.getters.getIsAuth) {
          this.$router.push("/signin")            
      }
  },  
}
</script>
