<template>
  <div>
    <UPageHero
      title="The high-speed security auditor that hardens your codebase"
      description="Automated scanning, hardcoded secret detection, and real-time risk visualization to secure your application in every commit"
      :links="[
        {
          label: 'Get started',
          to: 'https://github.com/apps/void-shield',
          target: '_blank',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'xl'
        }, {
          label: 'Docs',
          to: 'https://void-shield.vercel.app/docs/getting-started',
          target: '_blank',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle'
        }]"
    />

    <UPageSection
      id="features"
      title="Automated Security Auditing"
      description="Void Shield integrates directly into the development workflow to identify and mitigate security vulnerabilities within the repository."
      :features="[
        {
          icon: 'i-lucide-search',
          title: 'Commit-Level Scanning',
          description:
            'Executes security audits on every push and pull request to identify vulnerabilities before they are merged into the main branch.'
        },
        {
          icon: 'i-lucide-key',
          title: 'Secret Detection',
          description:
            'Utilizes a regex-based engine to detect hardcoded credentials, API keys, and authentication tokens in plain text files.'
        },
        {
          icon: 'i-lucide-zap',
          title: 'High-Speed Execution',
          description:
            'Optimized for low latency to ensure that security scanning does not impede the continuous integration and deployment pipeline.'
        },
        {
          icon: 'i-lucide-settings-2',
          title: 'JSON Configuration',
          description:
            'Define file exclusions using glob patterns in a .voidshield.json file located in the repository root via the ignorePaths property.'
        },
        {
          icon: 'i-simple-icons-github',
          title: 'Native GitHub Integration',
          description:
            'Authorized as a GitHub App to access repository metadata and content through the official GitHub API and webhooks.'
        },
        {
          icon: 'i-lucide-bar-chart-3',
          title: 'Risk Visualization',
          description:
            'Provides a dashboard for tracking vulnerability metrics and security status across all integrated repositories.'
        }
      ]"
    />

    <UPageSection>
      <UPageCTA
        title="Secure your codebase against credential leaks"
        description="Install the Void Shield GitHub App to automate your security workflow and implement real-time vulnerability detection."
        variant="subtle"
        :links="[
          {
            label: 'Install App',
            to: 'https://github.com/apps/void-shield',
            target: '_blank',
            trailingIcon: 'i-lucide-arrow-right',
            color: 'neutral'
          },
          {
            label: 'View Source',
            to: 'https://github.com/ahmoin/void-shield',
            target: '_blank',
            icon: 'i-simple-icons-github',
            color: 'neutral',
            variant: 'outline'
          }
        ]"
      />
    </UPageSection>
  </div>
</template>
