<template>
    <component :is="type" :data="props.data" :options="props.options" />
</template>

<script setup lang="ts">
import { Bar, Line, Scatter } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

// Import the datalabels plugin
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the necessary Chart.js components for a Line Chart
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const type = computed(() => {
    switch (props.type.toLowerCase()) {
        case 'bar':
            return Bar;
        case 'line':
            return Line;
        case 'scatter':
            return Scatter;
        default:
            throw new Error('Invalid chart type');
    }
});

// Define props for chart data and options
// Using `any` for simplicity in this example, but you might want more specific types
// based on Chart.js typings or your own data structure.
const props = defineProps<{
  data: any;
  options?: any; // Optional prop for chart options
  type: 'bar' | 'line' | 'scatter'; // Specify the type of chart
}>();

</script>