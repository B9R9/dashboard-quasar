<script>
export default {
  name: 'FeedNews',
  data () {
    return {
      columns: [
        {
          name: 'title',
          required: true,
          label: 'Title',
          align: 'left',
          field: row => row.title,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true },
        { name: 'source', align: 'center', label: 'Source', field: 'source', sortable: true }
      ],
      rows: [
        { id: 1, title: 'News Article 1', date: '2023-10-01', source: 'Source A' },
        { id: 2, title: 'News Article 2', date: '2023-10-02', source: 'Source B' },
        { id: 3, title: 'News Article 3', date: '2023-10-03', source: 'Source C' }

      ]
    }
  }
}
</script>

<template>
  <div>
    <q-table
      title="News Feed"
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      bordered
      dense
      hide-bottom>
    </q-table>
  </div>
</template>
