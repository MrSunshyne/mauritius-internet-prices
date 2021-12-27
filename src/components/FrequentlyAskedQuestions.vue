<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 divide-y divide-gray-200 sm:px-6 lg:py-16 lg:px-8">
      <h2 class="text-3xl font-extrabold text-gray-900">Frequently asked questions</h2>
      <div class="mt-8">
        <dl class="divide-y divide-gray-200">
          <div v-for="faq in faqs" :key="faq.id" class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
            <dt class="text-base font-medium text-gray-900 md:col-span-5">{{ faq.question }}</dt>
            <dd class="mt-2 md:mt-0 md:col-span-7">
              <p class="text-base text-gray-500">{{ faq.answer }}</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
const faqs = [
  {
    id: 1,
    question: "Why are you doing this ? Is this advertisment for a company ?",
    answer:
      "No. I have been a heavy internet user for many years and I love remote work. Comparing prepaid mobile internet is something I care about, and I though it would be worth sharing some kind of interactive infographic using the publicly available information.",
  },
  {
    id: 2,
    question: "Why Open Source this ?",
    answer:
      "Why not ?",
  },
  {
    id: 3,
    question: "Where is the data from?",
    answer:
      "The details regarding all packages are taken from publicly advertised prices from the websites of the service providers/telecommunication operators. Links to the source of the prices are also published.",
  },
  {
    id: 4,
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    id: 5,
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    id: 6,
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    id: 7,
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
]

export default {
  setup() {
    return {
      faqs,
    }
  },
}
</script>